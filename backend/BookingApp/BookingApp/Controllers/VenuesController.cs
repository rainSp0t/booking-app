using BookingApp.Data;
using BookingApp.DTOs.Venue;
using BookingApp.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace BookingApp.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "VenueOwner")]
public class VenuesController : ControllerBase
{
    private readonly ApplicationDbContext _context;


    public VenuesController(ApplicationDbContext context)
    {
        _context = context;
    }


    [HttpPost]
    public async Task<IActionResult> CreateVenue(CreateVenueDto dto)
    {
        var venue = new Venue
        {
            OwnerId = int.Parse(
                User.FindFirst(ClaimTypes.NameIdentifier)!.Value
            ),

            Name = dto.Name,
            Description = dto.Description,
            Address = dto.Address,
            ContactNumber = dto.ContactNumber,
           
            BookingDurationMinutes = dto.BookingDurationMinutes,
            CreatedAt = DateTime.UtcNow
        };


        _context.Venues.Add(venue);

        await _context.SaveChangesAsync();


        return Ok(new
        {
            venue.Id,
            venue.OwnerId,
            venue.Name,
            venue.Description,
            venue.Address,
            venue.ContactNumber,
            venue.BookingDurationMinutes,
            venue.CreatedAt
        });
    }

    [HttpGet("my-venues")]
    public async Task<IActionResult> GetMyVenues()
    {
        var userId = int.Parse(
            User.FindFirst(ClaimTypes.NameIdentifier)!.Value
        );

        var venues = await _context.Venues
            .Where(v => v.OwnerId == userId)
            .Select(v => new VenueSummaryDto
            {
                Id = v.Id,
                Name = v.Name,
                Description = v.Description,
                Address = v.Address,
                BookingDurationMinutes = v.BookingDurationMinutes
            })
            .ToListAsync();

        return Ok(venues);
    }

    [AllowAnonymous]
    [HttpGet]
    public async Task<IActionResult> GetVenues()
    {
        var venues = await _context.Venues
            .Select(v => new VenueSummaryDto
            {
                Id = v.Id,
                Name = v.Name,
                Description = v.Description,
                Address = v.Address,
                BookingDurationMinutes = v.BookingDurationMinutes
            })
            .ToListAsync();

        return Ok(venues);
    }

    [AllowAnonymous]
    [HttpGet("{id}")]
    public async Task<IActionResult> GetVenue(int id)
    {
        var venue = await _context.Venues
            .Include(v => v.Courts)
            .Include(v => v.OpeningHours)
            .FirstOrDefaultAsync(v => v.Id == id);

        if (venue == null)
        {
            return NotFound();
        }

        var dto = new VenueDetailsDto
        {
            Id = venue.Id,
            Name = venue.Name,
            Description = venue.Description,
            Address = venue.Address,
            ContactNumber = venue.ContactNumber,
            BookingDurationMinutes = venue.BookingDurationMinutes,

            Courts = venue.Courts
                .Select(c => new CourtDto
                {
                    Id = c.Id,
                    Name = c.Name,
                    Description = c.Description
                })
                .ToList(),

            OpeningHours = venue.OpeningHours
                .Select(o => new OpeningHoursDto
                {
                    DayOfWeek = o.DayOfWeek,
                    OpenTime = o.OpenTime,
                    CloseTime = o.CloseTime,
                    IsClosed = o.IsClosed
                })
                .ToList()
        };

        return Ok(dto);
    }
}