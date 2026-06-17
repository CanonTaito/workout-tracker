using Microsoft.EntityFrameworkCore;
using WorkoutTracker.Api.Models;

namespace WorkoutTracker.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Exercise> Exercises => Set<Exercise>();
    public DbSet<WorkoutSession> WorkoutSessions => Set<WorkoutSession>();
    public DbSet<WorkoutSet> WorkoutSets => Set<WorkoutSet>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Exercise>(e =>
        {
            e.HasKey(x => x.Id);
            e.Property(x => x.Name).HasMaxLength(200);
            e.Property(x => x.Category).HasMaxLength(50);
            e.Property(x => x.MuscleGroup).HasMaxLength(100);
        });

        modelBuilder.Entity<WorkoutSession>(w =>
        {
            w.HasKey(x => x.Id);
            w.HasMany(x => x.Sets)
             .WithOne()
             .HasForeignKey(x => x.WorkoutSessionId);
        });

        modelBuilder.Entity<WorkoutSet>(s =>
        {
            s.HasKey(x => x.Id);
        });
    }
}
