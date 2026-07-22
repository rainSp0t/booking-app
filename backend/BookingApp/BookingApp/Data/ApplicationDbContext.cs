using BookingApp.Models;
using Microsoft.EntityFrameworkCore;

namespace BookingApp.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(
        DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    // Database tables will go here.
}