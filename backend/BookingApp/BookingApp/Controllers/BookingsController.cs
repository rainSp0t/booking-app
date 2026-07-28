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

        return Ok(booking);
    }
}