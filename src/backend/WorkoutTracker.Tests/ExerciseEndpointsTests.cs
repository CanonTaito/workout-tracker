using System.Net.Http.Json;
using Microsoft.AspNetCore.Mvc.Testing;
using WorkoutTracker.Api.Models;

namespace WorkoutTracker.Tests;

public class ExerciseEndpointsTests
{
    [Fact]
    public async Task CreateAndListExercises()
    {
        var factory = new WebApplicationFactory<Program>();
        var client = factory.CreateClient();

        var newExercise = new Exercise
        {
            Name = "Bench Press",
            Category = "Strength",
            MuscleGroup = "Chest"
        };

        var created = await client.PostAsJsonAsync("/api/exercises", newExercise);
        created.EnsureSuccessStatusCode();

        var exercise = await created.Content.ReadFromJsonAsync<Exercise>();
        Assert.NotNull(exercise);
        Assert.Equal("Bench Press", exercise.Name);

        var exercises = await client.GetFromJsonAsync<List<Exercise>>("/api/exercises");
        Assert.NotNull(exercises);
        Assert.Contains(exercises, e => e.Name == "Bench Press");
    }
}
