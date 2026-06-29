namespace MyFitCoach.API.DTOs.Workout
{
    public class WorkoutResponseDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string? Goal { get; set; }
        public int DurationWeeks { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}