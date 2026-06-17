namespace WorkoutTracker.Api.Models;

public class WorkoutSession
{
    public int Id { get; set; }
    public DateTime Date { get; set; }
    public int DurationMinutes { get; set; }
    public string? Notes { get; set; }
    public string? UserId { get; set; }
    public List<WorkoutSet> Sets { get; set; } = [];
}
