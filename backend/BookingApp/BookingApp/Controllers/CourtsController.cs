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

    [HttpGet("{courtId}/availability")]
    [AllowAnonymous]
    public async Task<IActionResult> GetAvailability(
    int courtId,
    DateTime date)
    {
        var court = await _context.Courts
            .Include(c => c.Venue)
            .ThenInclude(v => v.OpeningHours)
            .Include(c => c.Bookings)
            .FirstOrDefaultAsync(c => c.Id == courtId);

        if (court == null)
        {
            return NotFound();
        }

        var openingHours = court.Venue?.OpeningHours
            .FirstOrDefault(o => o.DayOfWeek == date.DayOfWeek);

        if (openingHours == null)
        {
            return BadRequest("Opening hours are not configured for this day.");
        }

        if (openingHours.IsClosed)
        {
            return BadRequest("Venue is closed on this day.");
        }

        var currentSlot = date.Date + openingHours.OpenTime;

        var closingTime = date.Date + openingHours.CloseTime;


        if (date.Date == DateTime.Today)
        {
            var now = DateTime.Now;

            if (currentSlot < now)
            {
                var elapsedMinutes = (int)(now - currentSlot).TotalMinutes;

                var durationMinutes = court.Venue!.BookingDurationMinutes;

                var periods = (elapsedMinutes + durationMinutes - 1)
                    / durationMinutes;

                currentSlot = currentSlot.AddMinutes(
                    periods * durationMinutes
                );
            }
        }


        var slotDuration = TimeSpan.FromMinutes(
            court.Venue!.BookingDurationMinutes
        );

        var slots = new List<AvailabilitySlotDto>();

        while (currentSlot + slotDuration <= closingTime)
        {
            var slotEnd = currentSlot + slotDuration;

            var booked = court.Bookings.Any(b =>
                currentSlot < b.EndTime &&
                slotEnd > b.StartTime
            );

            slots.Add(new AvailabilitySlotDto
            {
                StartTime = currentSlot,
                EndTime = slotEnd,
                Available = !booked
            });

            currentSlot = slotEnd;
        }

        return Ok(slots);
    }
}