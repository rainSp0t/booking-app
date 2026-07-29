using BookingApp.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BookingApp.Controllers;

[ApiController]
[Route("api/dev")]
public class DevController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public DevController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpDelete("reset-database")]
    public async Task<IActionResult> ResetDatabase()
    {
        // Delete data in dependency order
        _context.Bookings.RemoveRange(_context.Bookings);
        _context.OpeningHours.RemoveRange(_context.OpeningHours);
        _context.Courts.RemoveRange(_context.Courts);
        _context.Venues.RemoveRange(_context.Venues);
        _context.Users.RemoveRange(_context.Users);

        await _context.Database.ExecuteSqlRawAsync(
            "DBCC CHECKIDENT ('Users', RESEED, 0)"
        );

        await _context.Database.ExecuteSqlRawAsync(
            "DBCC CHECKIDENT ('Venues', RESEED, 0)"
        );

        await _context.Database.ExecuteSqlRawAsync(
            "DBCC CHECKIDENT ('Courts', RESEED, 0)"
        );

        await _context.Database.ExecuteSqlRawAsync(
            "DBCC CHECKIDENT ('Bookings', RESEED, 0)"
        );

        await _context.Database.ExecuteSqlRawAsync(
            "DBCC CHECKIDENT ('OpeningHours', RESEED, 0)"
        );

        await _context.SaveChangesAsync();

        return Ok(new
        {
            message = "Database reset successfully."
        });
    }
}