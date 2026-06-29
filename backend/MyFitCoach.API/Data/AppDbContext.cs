using Microsoft.EntityFrameworkCore;
using MyFitCoach.Api.Models;
using MyFitCoach.API.Models;

namespace MyFitCoach.API.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public DbSet<User> Users => Set<User>();
    public DbSet<WorkoutPlan> WorkoutPlans { get; set; }

    public DbSet<WorkoutExercise> WorkoutExercises { get; set; }
}