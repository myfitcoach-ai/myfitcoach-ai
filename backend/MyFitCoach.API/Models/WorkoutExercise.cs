using MyFitCoach.Api.Models;
using System.ComponentModel.DataAnnotations;

namespace MyFitCoach.API.Models
{
    public class WorkoutExercise
    {
        public int Id { get; set; }

        [Required]
        public string ExerciseName { get; set; } = string.Empty;

        public string? MuscleGroup { get; set; }

        public int Sets { get; set; }

        public string Reps { get; set; } = string.Empty;

        public int RestSeconds { get; set; }

        public string? Notes { get; set; }

        public int WorkoutPlanId { get; set; }

        public WorkoutPlan WorkoutPlan { get; set; } = null!;
    }
}