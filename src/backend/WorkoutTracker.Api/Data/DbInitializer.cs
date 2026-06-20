using WorkoutTracker.Api.Models;

namespace WorkoutTracker.Api.Data
{
    public static class DbInitialiser
    {
        public static void Seed(AppDbContext db)
        {
            if (db.Exercises.Any()) return; // already seeded

            db.Exercises.AddRange(
                new Exercise { Name = "Bench Press", Category = "Strength", MuscleGroup = "Chest" },
                new Exercise { Name = "Incline Bench Press", Category = "Strength", MuscleGroup = "Upper Chest" },
                new Exercise { Name = "Squat", Category = "Strength", MuscleGroup = "Quads" },
                new Exercise { Name = "Deadlift", Category = "Strength", MuscleGroup = "Back" },
                new Exercise { Name = "Overhead Press", Category = "Strength", MuscleGroup = "Shoulders" },
                new Exercise { Name = "Barbell Row", Category = "Strength", MuscleGroup = "Back" },
                new Exercise { Name = "Pull-up", Category = "Strength", MuscleGroup = "Back" },
                new Exercise { Name = "Dumbbell Curl", Category = "Accessory", MuscleGroup = "Biceps" },
                new Exercise { Name = "Tricep Pushdown", Category = "Accessory", MuscleGroup = "Triceps" },
                new Exercise { Name = "Plank", Category = "Core", MuscleGroup = "Abs" }
            );

            db.SaveChanges();
        }
    }
}
