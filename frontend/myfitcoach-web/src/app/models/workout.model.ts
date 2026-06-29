export interface CreateWorkoutDto {
  title: string;
  description: string;
  goal: string;
  durationWeeks: number;
}

export interface UpdateWorkoutDto {
  title: string;
  description: string;
  goal: string;
  durationWeeks: number;
}

export interface WorkoutResponseDto {
  id: number | string;
  title: string;
  description: string;
  goal: string;
  durationWeeks: number;
  createdAt?: string;
  updatedAt?: string;
}