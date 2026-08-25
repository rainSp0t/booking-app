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
}