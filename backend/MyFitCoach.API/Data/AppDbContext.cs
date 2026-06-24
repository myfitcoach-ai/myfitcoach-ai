using Microsoft.EntityFrameworkCore;
using MyFitCoach.API.Models;

namespace MyFitCoach.API.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public DbSet<User> Users => Set<User>();
}