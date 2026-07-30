using BookingApp.Data;
using BookingApp.DTOs.Court;
using BookingApp.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace BookingApp.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "VenueOwner")]
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
        var userId = int.Parse(
            User.FindFirst(ClaimTypes.NameIdentifier)!.Value
        );

        var venue = await _context.Venues
            .FirstOrDefaultAsync(v =>
                v.Id == dto.VenueId &&
                v.OwnerId == userId
            );

        if (venue == null)
        {
            return Unauthorized(
                "You do not own this venue."
            );
        }

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


        return Ok(new
        {
            court.Id,
            court.VenueId,
            court.Name,
            court.Description,
            court.IsActive,
            court.CreatedAt
        });
    }
}