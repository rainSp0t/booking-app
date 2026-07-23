using BookingApp.Data;
using BookingApp.DTOs.Court;
using BookingApp.Models;
using Microsoft.AspNetCore.Mvc;

namespace BookingApp.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CourtsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public CourtsController(ApplicationDbContext context)
    {
        _context = context;
    }


    [HttpPost]
    public async Task<IActionResult> CreateCourt(CreateCourtDto dto)
    {
        var court = new Court
        {
            VenueId = dto.VenueId,
            Name = dto.Name,
            Description = dto.Description,
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        };


        _context.Courts.Add(court);

        await _context.SaveChangesAsync();


        return Ok(court);
    }
}