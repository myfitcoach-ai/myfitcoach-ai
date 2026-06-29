using MyFitCoach.API.Models;
using System.ComponentModel.DataAnnotations;

namespace MyFitCoach.Api.Models
{
    public class WorkoutPlan
    {
        public int Id { get; set; }

        [Required]
        public string Title { get; set; } = string.Empty;

        public string? Description { get; set; }

        public string? Goal { get; set; }

        public int DurationWeeks { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Foreign key
        public int UserId { get; set; }

        // Navigation property
        public User User { get; set; } = null!;

        public ICollection<WorkoutExercise> Exercises { get; set; } = new List<WorkoutExercise>();
    }
}