using BookingApp.Data;
using BookingApp.DTOs.Booking;
using BookingApp.Models;
using Microsoft.AspNetCore.Mvc;

namespace BookingApp.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BookingsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public BookingsController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpPost]
    public async Task<IActionResult> CreateBooking(CreateBookingDto dto)
    {
        var court = await _context.Courts.FindAsync(dto.CourtId);

        if (court == null)
        {
            return NotFound("Court not found.");
        }

        var openingHours = _context.OpeningHours.FirstOrDefault(
            oh =>
                oh.VenueId == court.VenueId &&
                oh.DayOfWeek == dto.StartTime.DayOfWeek
        );

        if (openingHours == null)
        {
            return BadRequest("Venue opening hours not configured.");
        }

        if (openingHours.IsClosed)
        {
            return BadRequest("Venue is closed on this day.");
        }

        if (dto.StartTime.TimeOfDay < openingHours.OpenTime ||
            dto.EndTime.TimeOfDay > openingHours.CloseTime)
        {
            return BadRequest("Booking is outside venue opening hours.");
        }


        var conflictingBooking = _context.Bookings.Any(
            b =>
                b.CourtId == dto.CourtId &&
                dto.StartTime < b.EndTime &&
                dto.EndTime > b.StartTime
        );

        if (conflictingBooking)
        {
            return BadRequest("This time slot is already booked.");
        }

        var booking = new Booking
        {
            UserId = dto.UserId,
            CourtId = dto.CourtId,
            StartTime = dto.StartTime,
            EndTime = dto.EndTime,
            Status = "Confirmed",
            CreatedAt = DateTime.UtcNow
        };

        _context.Bookings.Add(booking);

        await _context.SaveChangesAsync();

        return Ok(new
        {
            booking.Id,
            booking.UserId,
            booking.CourtId,
            booking.StartTime,
            booking.EndTime,
            booking.Status,
            booking.CreatedAt
        });
    }
}