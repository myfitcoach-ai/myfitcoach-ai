namespace MyFitCoach.API.DTOs.Workout
{
    public class UpdateWorkoutDto
    {
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string? Goal { get; set; }
        public int DurationWeeks { get; set; }
    }
}