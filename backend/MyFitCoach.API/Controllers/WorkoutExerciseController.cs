using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyFitCoach.API.Data;
using MyFitCoach.API.DTOs.WorkoutExercise;
using MyFitCoach.API.Models;
using System.Security.Claims;

namespace MyFitCoach.API.Controllers;

[Route("api/workout")]
[ApiController]
[Authorize]
public class WorkoutExerciseController : ControllerBase
{
    private readonly AppDbContext _context;

    public WorkoutExerciseController(AppDbContext context)
    {
        _context = context;
    }

    private int GetUserId()
    {
        return int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
    }

    [HttpGet("{workoutPlanId}/exercises")]
    public async Task<IActionResult> GetExercises(int workoutPlanId)
    {
        var userId = GetUserId();

        var workoutPlanExists = await _context.WorkoutPlans
            .AnyAsync(w => w.Id == workoutPlanId && w.UserId == userId);

        if (!workoutPlanExists)
            return NotFound("Workout plan not found.");

        var exercises = await _context.WorkoutExercises
            .Where(e => e.WorkoutPlanId == workoutPlanId)
            .Select(e => new WorkoutExerciseResponseDto
            {
                Id = e.Id,
                ExerciseName = e.ExerciseName,
                MuscleGroup = e.MuscleGroup,
                Sets = e.Sets,
                Reps = e.Reps,
                RestSeconds = e.RestSeconds,
                Notes = e.Notes,
                WorkoutPlanId = e.WorkoutPlanId
            })
            .ToListAsync();

        return Ok(exercises);
    }

    [HttpPost("{workoutPlanId}/exercises")]
    public async Task<IActionResult> CreateExercise(
        int workoutPlanId,
        CreateWorkoutExerciseDto request)
    {
        var userId = GetUserId();

        var workoutPlanExists = await _context.WorkoutPlans
            .AnyAsync(w => w.Id == workoutPlanId && w.UserId == userId);

        if (!workoutPlanExists)
            return NotFound("Workout plan not found.");

        var exercise = new WorkoutExercise
        {
            ExerciseName = request.ExerciseName,
            MuscleGroup = request.MuscleGroup,
            Sets = request.Sets,
            Reps = request.Reps,
            RestSeconds = request.RestSeconds,
            Notes = request.Notes,
            WorkoutPlanId = workoutPlanId
        };

        _context.WorkoutExercises.Add(exercise);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Exercise added successfully." });
    }

    [HttpPut("exercises/{exerciseId}")]
    public async Task<IActionResult> UpdateExercise(
        int exerciseId,
        UpdateWorkoutExerciseDto request)
    {
        var userId = GetUserId();

        var exercise = await _context.WorkoutExercises
            .Include(e => e.WorkoutPlan)
            .FirstOrDefaultAsync(e =>
                e.Id == exerciseId &&
                e.WorkoutPlan.UserId == userId);

        if (exercise == null)
            return NotFound("Exercise not found.");

        exercise.ExerciseName = request.ExerciseName;
        exercise.MuscleGroup = request.MuscleGroup;
        exercise.Sets = request.Sets;
        exercise.Reps = request.Reps;
        exercise.RestSeconds = request.RestSeconds;
        exercise.Notes = request.Notes;

        await _context.SaveChangesAsync();

        return Ok(new { message = "Exercise updated successfully." });
    }

    [HttpDelete("exercises/{exerciseId}")]
    public async Task<IActionResult> DeleteExercise(int exerciseId)
    {
        var userId = GetUserId();

        var exercise = await _context.WorkoutExercises
            .Include(e => e.WorkoutPlan)
            .FirstOrDefaultAsync(e =>
                e.Id == exerciseId &&
                e.WorkoutPlan.UserId == userId);

        if (exercise == null)
            return NotFound("Exercise not found.");

        _context.WorkoutExercises.Remove(exercise);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Exercise deleted successfully." });
    }
}