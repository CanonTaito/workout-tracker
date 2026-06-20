using System.Net.Http.Json;
using Microsoft.AspNetCore.Mvc.Testing;
using WorkoutTracker.Api.Models;

namespace WorkoutTracker.Tests;

public class WorkoutSessionEndpointsTests
{
    private static async Task<(HttpClient client, int exerciseId)> CreateClientWithExercise()
    {
        var factory = new WebApplicationFactory<Program>();
        var client = factory.CreateClient();

        var exercise = new Exercise { Name = "Bench Press", Category = "Strength", MuscleGroup = "Chest" };
        var response = await client.PostAsJsonAsync("/api/exercises", exercise);
        response.EnsureSuccessStatusCode();
        var created = await response.Content.ReadFromJsonAsync<Exercise>();

        return (client, created!.Id);
    }

    private static async Task<WorkoutSession> CreateSession(HttpClient client, string notes, int durationMinutes)
    {
        var session = new WorkoutSession
        {
            Date = DateTime.UtcNow,
            DurationMinutes = durationMinutes,
            Notes = notes
        };
        var response = await client.PostAsJsonAsync("/api/sessions", session);
        response.EnsureSuccessStatusCode();
        return (await response.Content.ReadFromJsonAsync<WorkoutSession>())!;
    }

    [Fact]
    public async Task CreateAndListSessions()
    {
        var (client, _) = await CreateClientWithExercise();

        var session = await CreateSession(client, "Morning workout", 60);

        Assert.Equal(60, session.DurationMinutes);

        var sessions = await client.GetFromJsonAsync<List<WorkoutSession>>("/api/sessions");
        Assert.NotNull(sessions);
        Assert.Contains(sessions, s => s.Notes == "Morning workout");
    }

    [Fact]
    public async Task GetSessionById_ReturnsNestedSets()
    {
        var (client, exerciseId) = await CreateClientWithExercise();

        var session = await CreateSession(client, "Quick session", 45);

        var newSet = new WorkoutSet
        {
            ExerciseId = exerciseId,
            Sets = 3,
            Reps = 10,
            WeightKg = 80,
            Rpe = 8
        };

        var setCreated = await client.PostAsJsonAsync($"/api/sessions/{session.Id}/sets", newSet);
        setCreated.EnsureSuccessStatusCode();

        var fetchedSession = await client.GetFromJsonAsync<WorkoutSession>($"/api/sessions/{session.Id}");
        Assert.NotNull(fetchedSession);
        Assert.NotNull(fetchedSession.Sets);
        Assert.Single(fetchedSession.Sets);
        Assert.Equal(80, fetchedSession.Sets[0].WeightKg);
    }

    [Fact]
    public async Task AddSetToSession()
    {
        var (client, exerciseId) = await CreateClientWithExercise();

        var session = await CreateSession(client, "Test session", 30);

        var newSet = new WorkoutSet
        {
            ExerciseId = exerciseId,
            Sets = 5,
            Reps = 5,
            WeightKg = 100,
            Rpe = 9
        };

        var setCreated = await client.PostAsJsonAsync($"/api/sessions/{session.Id}/sets", newSet);
        setCreated.EnsureSuccessStatusCode();

        var set = await setCreated.Content.ReadFromJsonAsync<WorkoutSet>();
        Assert.NotNull(set);
        Assert.Equal(5, set.Sets);
        Assert.Equal(100, set.WeightKg);
    }

    [Fact]
    public async Task DeleteSession_CascadesSets()
    {
        var (client, _) = await CreateClientWithExercise();

        var session = await CreateSession(client, "To delete", 30);

        var deleted = await client.DeleteAsync($"/api/sessions/{session.Id}");
        Assert.Equal(System.Net.HttpStatusCode.NoContent, deleted.StatusCode);

        var fetched = await client.GetAsync($"/api/sessions/{session.Id}");
        Assert.Equal(System.Net.HttpStatusCode.NotFound, fetched.StatusCode);
    }
}
