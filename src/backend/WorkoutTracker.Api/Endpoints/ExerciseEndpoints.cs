using Microsoft.EntityFrameworkCore;
using WorkoutTracker.Api.Data;
using WorkoutTracker.Api.Models;

namespace WorkoutTracker.Api.Endpoints;

public static class ExerciseEndpoints
{
    public static void MapExerciseEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/api/exercises");

        group.MapGet("/", async (AppDbContext db) =>
            await db.Exercises.OrderBy(e => e.Id).ToListAsync());

        group.MapGet("/{id:int}", async (int id, AppDbContext db) =>
        {
            var exercise = await db.Exercises.FindAsync(id);
            return exercise is not null ? Results.Ok(exercise) : Results.NotFound();
        });

        group.MapPost("/", async (Exercise exercise, AppDbContext db) =>
        {
            db.Exercises.Add(exercise);
            await db.SaveChangesAsync();
            return Results.Created($"/api/exercises/{exercise.Id}", exercise);
        });

        group.MapPut("/{id:int}", async (int id, Exercise updated, AppDbContext db) =>
        {
            var exercise = await db.Exercises.FindAsync(id);
            if (exercise is null) return Results.NotFound();

            exercise.Name = updated.Name;
            exercise.Category = updated.Category;
            exercise.MuscleGroup = updated.MuscleGroup;

            await db.SaveChangesAsync();
            return Results.Ok(exercise);
        });

        group.MapDelete("/{id:int}", async (int id, AppDbContext db) =>
        {
            var exercise = await db.Exercises.FindAsync(id);
            if (exercise is null) return Results.NotFound();

            db.Exercises.Remove(exercise);
            await db.SaveChangesAsync();
            return Results.NoContent();
        });
    }
}
