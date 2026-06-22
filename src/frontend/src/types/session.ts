import type { WorkoutSet } from "./set";

export interface WorkoutSession {
  id: number;
  date: string;
  durationMinutes: number;
  notes?: string;
  userId?: string;
  sets: WorkoutSet[];
}