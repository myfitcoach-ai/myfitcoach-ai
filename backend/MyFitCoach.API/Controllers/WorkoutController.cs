using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyFitCoach.Api.Models;
using MyFitCoach.API.Data;
using MyFitCoach.API.DTOs.Workout;
using MyFitCoach.API.Models;
using System.Security.Claims;

namespace MyFitCoach.API.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class WorkoutController : ControllerBase
{
    private readonly AppDbContext _context;

    public WorkoutController(AppDbContext context)
    {
        _context = context;
    }

    private int GetUserId()
    {
        return int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
    }

    [HttpGet]
    public async Task<IActionResult> GetMyWorkouts()
    {
        var userId = GetUserId();

        var workouts = await _context.WorkoutPlans
            .Where(w => w.UserId == userId)
            .Select(w => new WorkoutResponseDto
            {
                Id = w.Id,
                Title = w.Title,
                Description = w.Description,
                Goal = w.Goal,
                DurationWeeks = w.DurationWeeks,
                CreatedAt = w.CreatedAt
            })
            .ToListAsync();

        return Ok(workouts);
    }

    [HttpPost]
    public async Task<IActionResult> CreateWorkout(CreateWorkoutDto request)
    {
        var userId = GetUserId();

        var workout = new WorkoutPlan
        {
            Title = request.Title,
            Description = request.Description,
            Goal = request.Goal,
            DurationWeeks = request.DurationWeeks,
            UserId = userId
        };

        _context.WorkoutPlans.Add(workout);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Workout plan created successfully." });
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateWorkout(int id, UpdateWorkoutDto request)
    {
        var userId = GetUserId();

        var workout = await _context.WorkoutPlans
            .FirstOrDefaultAsync(w => w.Id == id && w.UserId == userId);

        if (workout == null)
            return NotFound("Workout plan not found.");

        workout.Title = request.Title;
        workout.Description = request.Description;
        workout.Goal = request.Goal;
        workout.DurationWeeks = request.DurationWeeks;

        await _context.SaveChangesAsync();

        return Ok(new { message = "Workout plan updated successfully." });
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteWorkout(int id)
    {
        var userId = GetUserId();

        var workout = await _context.WorkoutPlans
            .FirstOrDefaultAsync(w => w.Id == id && w.UserId == userId);

        if (workout == null)
            return NotFound("Workout plan not found.");

        _context.WorkoutPlans.Remove(workout);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Workout plan deleted successfully." });
    }
}