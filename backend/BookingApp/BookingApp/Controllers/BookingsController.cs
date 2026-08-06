using BookingApp.Data;
using BookingApp.DTOs.Booking;
using BookingApp.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace BookingApp.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
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
        var userId = int.Parse(
            User.FindFirst(ClaimTypes.NameIdentifier)!.Value
        );

        var court = await _context.Courts
            .Include(c => c.Venue)
            .FirstOrDefaultAsync(c => c.Id == dto.CourtId);

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

        if (dto.EndTime.Date != dto.StartTime.Date)
        {
            return BadRequest("Booking cannot span multiple days.");
        }


        if (dto.StartTime.TimeOfDay < openingHours.OpenTime ||
            dto.EndTime > dto.StartTime.Date.Add(openingHours.CloseTime))
        {
            return BadRequest("Booking is outside venue opening hours.");
        }

        var bookingDuration = dto.EndTime - dto.StartTime;

        if (bookingDuration.TotalMinutes != court.Venue.BookingDurationMinutes)
        {
            return BadRequest("Invalid booking duration.");
        }

        // Validate booking starts on a valid time slot boundary
        if (court.Venue.BookingDurationMinutes == 60 &&
            dto.StartTime.Minute != 0)
        {
            return BadRequest("Hourly bookings must start on the hour.");
        }

        if (court.Venue.BookingDurationMinutes == 30 &&
            dto.StartTime.Minute != 0 &&
            dto.StartTime.Minute != 30)
        {
            return BadRequest("30-minute bookings must start on the hour or half hour.");
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
            UserId = userId,
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


    [HttpGet("my-bookings")]
    public async Task<IActionResult> GetMyBookings()
    {
        var userId = int.Parse(
            User.FindFirst(ClaimTypes.NameIdentifier)!.Value
        );

        var bookings = await _context.Bookings
            .Include(b => b.Court)
                .ThenInclude(c => c.Venue)
            .Where(b => b.UserId == userId)
            .OrderBy(b => b.StartTime)
            .ToListAsync();

        var result = bookings.Select(b => new BookingSummaryDto
        {
            Id = b.Id,
            VenueName = b.Court.Venue.Name,
            CourtName = b.Court.Name,
            StartTime = b.StartTime,
            EndTime = b.EndTime,
            Status = b.Status
        });

        return Ok(result);
    }

}