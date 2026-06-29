export interface CreateWorkoutExerciseDto {
  exerciseName: string;
  muscleGroup: string;
  sets: number;
  reps: string;
  restSeconds: number;
  notes: string;
}

export interface UpdateWorkoutExerciseDto {
  exerciseName: string;
  muscleGroup: string;
  sets: number;
  reps: string;
  restSeconds: number;
  notes: string;
}

export interface WorkoutExerciseResponseDto {
  id: number | string;
  workoutPlanId?: number | string;
  exerciseName: string;
  muscleGroup: string;
  sets: number;
  reps: string;
  restSeconds: number;
  notes: string;
  createdAt?: string;
  updatedAt?: string;
}