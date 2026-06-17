namespace WorkoutTracker.Api.Models;

public class Exercise
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string MuscleGroup { get; set; } = string.Empty;
    public string? UserId { get; set; }
}
