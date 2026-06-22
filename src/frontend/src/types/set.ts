export interface WorkoutSet {
  id: number;
  workoutSessionId: number;
  exerciseId: number;
  sets: number;
  reps: number;
  weightKg: number;
  rpe?: number;
}