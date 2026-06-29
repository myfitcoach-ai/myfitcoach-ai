namespace MyFitCoach.API.DTOs.WorkoutExercise
{
    public class UpdateWorkoutExerciseDto
    {
        public string ExerciseName { get; set; } = string.Empty;
        public string? MuscleGroup { get; set; }
        public int Sets { get; set; }
        public string Reps { get; set; } = string.Empty;
        public int RestSeconds { get; set; }
        public string? Notes { get; set; }
    }
}