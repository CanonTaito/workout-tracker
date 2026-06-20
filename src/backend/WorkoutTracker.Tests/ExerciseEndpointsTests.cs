using System.Net.Http.Json;
using Microsoft.AspNetCore.Mvc.Testing;
using WorkoutTracker.Api.Models;

namespace WorkoutTracker.Tests;

public class ExerciseEndpointsTests
{
    private static HttpClient CreateClient()
    {
        var factory = new WebApplicationFactory<Program>();
        return factory.CreateClient();
    }

    private static async Task<Exercise> CreateExercise(HttpClient client, string name, string category, string muscleGroup)
    {
        var exercise = new Exercise { Name = name, Category = category, MuscleGroup = muscleGroup };
        var response = await client.PostAsJsonAsync("/api/exercises", exercise);
        response.EnsureSuccessStatusCode();
        return (await response.Content.ReadFromJsonAsync<Exercise>())!;
    }

    [Fact]
    public async Task CreateAndListExercises()
    {
        var client = CreateClient();

        var exercise = await CreateExercise(client, "Bench Press", "Strength", "Chest");

        Assert.Equal("Bench Press", exercise.Name);

        var exercises = await client.GetFromJsonAsync<List<Exercise>>("/api/exercises");
        Assert.NotNull(exercises);
        Assert.Contains(exercises, e => e.Name == "Bench Press");
    }

    [Fact]
    public async Task GetExerciseById_ReturnsExercise()
    {
        var client = CreateClient();

        var exercise = await CreateExercise(client, "Squat", "Strength", "Quads");

        var fetched = await client.GetFromJsonAsync<Exercise>($"/api/exercises/{exercise.Id}");
        Assert.NotNull(fetched);
        Assert.Equal("Squat", fetched.Name);
    }

    [Fact]
    public async Task GetExerciseById_Returns404_WhenNotFound()
    {
        var client = CreateClient();

        var response = await client.GetAsync("/api/exercises/999");
        Assert.Equal(System.Net.HttpStatusCode.NotFound, response.StatusCode);
    }

    [Fact]
    public async Task UpdateExercise_ModifiesExercise()
    {
        var client = CreateClient();

        var exercise = await CreateExercise(client, "Pull-up", "Strength", "Back");

        exercise.Name = "Chin-up";
        exercise.MuscleGroup = "Biceps";

        var updated = await client.PutAsJsonAsync($"/api/exercises/{exercise.Id}", exercise);
        updated.EnsureSuccessStatusCode();

        var fetched = await client.GetFromJsonAsync<Exercise>($"/api/exercises/{exercise.Id}");
        Assert.NotNull(fetched);
        Assert.Equal("Chin-up", fetched.Name);
        Assert.Equal("Biceps", fetched.MuscleGroup);
    }

    [Fact]
    public async Task DeleteExercise_RemovesIt()
    {
        var client = CreateClient();

        var exercise = await CreateExercise(client, "Deadlift", "Strength", "Back");

        var deleted = await client.DeleteAsync($"/api/exercises/{exercise.Id}");
        Assert.Equal(System.Net.HttpStatusCode.NoContent, deleted.StatusCode);

        var fetched = await client.GetAsync($"/api/exercises/{exercise.Id}");
        Assert.Equal(System.Net.HttpStatusCode.NotFound, fetched.StatusCode);
    }
}
