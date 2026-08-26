using BookingApp.Data;
using BookingApp.DTOs.OpeningHours;
using BookingApp.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace BookingApp.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "VenueOwner")]
public class OpeningHoursController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public OpeningHoursController(ApplicationDbContext context)
    {
        _context = context;
    }


    [HttpPost]
    public async Task<IActionResult> CreateOpeningHours(CreateOpeningHoursDto dto)
    {
        if (!Enum.IsDefined(typeof(DayOfWeek), dto.DayOfWeek))
        {
            return BadRequest("Invalid day of week.");
        }

        if (!dto.IsClosed && dto.OpenTime >= dto.CloseTime)
        {
            return BadRequest(
                "Opening time must be earlier than closing time."
            );
        }

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
            return Unauthorized("You do not own this venue.");
        }

        // Prevent duplicate opening hours for the same venue/day.
        var existingOpeningHours = await _context.OpeningHours
            .FirstOrDefaultAsync(o =>
                o.VenueId == dto.VenueId &&
                o.DayOfWeek == dto.DayOfWeek
            );

        if (existingOpeningHours != null)
        {
            return BadRequest(
                "Opening hours already exist for this day."
            );
        }

        var openingHours = new OpeningHours
        {
            VenueId = dto.VenueId,
            DayOfWeek = dto.DayOfWeek,
            OpenTime = dto.OpenTime,
            CloseTime = dto.CloseTime,
            IsClosed = dto.IsClosed
        };

        _context.OpeningHours.Add(openingHours);

        await _context.SaveChangesAsync();

        return Ok(new
        {
            openingHours.Id,
            openingHours.VenueId,
            openingHours.DayOfWeek,
            openingHours.OpenTime,
            openingHours.CloseTime,
            openingHours.IsClosed
        });
    }


    [HttpGet("venue/{venueId}")]
    public async Task<IActionResult> GetOpeningHours(int venueId)
    {
        var userId = int.Parse(
            User.FindFirst(ClaimTypes.NameIdentifier)!.Value
        );

        var venue = await _context.Venues
            .FirstOrDefaultAsync(v =>
                v.Id == venueId &&
                v.OwnerId == userId
            );

        if (venue == null)
        {
            return Unauthorized("You do not own this venue.");
        }

        var openingHours = await _context.OpeningHours
            .Where(o => o.VenueId == venueId)
            .Select(o => new
            {
                o.Id,
                o.VenueId,
                o.DayOfWeek,
                o.OpenTime,
                o.CloseTime,
                o.IsClosed
            })
            .ToListAsync();

        return Ok(openingHours);
    }


    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateOpeningHours(
        int id,
        UpdateOpeningHoursDto dto)
    {
        if (!Enum.IsDefined(typeof(DayOfWeek), dto.DayOfWeek))
        {
            return BadRequest("Invalid day of week.");
        }

        var userId = int.Parse(
            User.FindFirst(ClaimTypes.NameIdentifier)!.Value
        );

        var openingHours = await _context.OpeningHours
            .Include(o => o.Venue)
            .FirstOrDefaultAsync(o => o.Id == id);

        if (openingHours == null)
        {
            return NotFound("Opening hours not found.");
        }

        if (openingHours.Venue.OwnerId != userId)
        {
            return Unauthorized(
                "You do not own this venue."
            );
        }

        if (!dto.IsClosed && dto.OpenTime >= dto.CloseTime)
        {
            return BadRequest(
                "Opening time must be earlier than closing time."
            );
        }

        // Prevent changing this record to a day that already
        // has opening hours configured for the same venue.
        var duplicateDay = await _context.OpeningHours
            .AnyAsync(o =>
                o.VenueId == openingHours.VenueId &&
                o.DayOfWeek == dto.DayOfWeek &&
                o.Id != id
            );

        if (duplicateDay)
        {
            return BadRequest(
                "Opening hours already exist for this day."
            );
        }

        openingHours.DayOfWeek = dto.DayOfWeek;
        openingHours.OpenTime = dto.OpenTime;
        openingHours.CloseTime = dto.CloseTime;
        openingHours.IsClosed = dto.IsClosed;

        await _context.SaveChangesAsync();

        return Ok(new
        {
            openingHours.Id,
            openingHours.VenueId,
            openingHours.DayOfWeek,
            openingHours.OpenTime,
            openingHours.CloseTime,
            openingHours.IsClosed
        });
    }


    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteOpeningHours(int id)
    {
        var userId = int.Parse(
            User.FindFirst(ClaimTypes.NameIdentifier)!.Value
        );

        var openingHours = await _context.OpeningHours
            .Include(o => o.Venue)
            .FirstOrDefaultAsync(o => o.Id == id);

        if (openingHours == null)
        {
            return NotFound("Opening hours not found.");
        }

        if (openingHours.Venue.OwnerId != userId)
        {
            return Unauthorized(
                "You do not own this venue."
            );
        }

        _context.OpeningHours.Remove(openingHours);

        await _context.SaveChangesAsync();

        return Ok(new
        {
            Message = "Opening hours deleted successfully."
        });
    }
}