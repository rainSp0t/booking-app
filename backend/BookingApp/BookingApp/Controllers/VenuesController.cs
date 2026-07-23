using BookingApp.Data;
using BookingApp.DTOs.Venue;
using BookingApp.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BookingApp.Controllers;

[ApiController]
[Route("api/[controller]")]
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
            Name = dto.Name,
            Description = dto.Description,
            Address = dto.Address,
            ContactNumber = dto.ContactNumber,
            OwnerId = dto.OwnerId,
            CreatedAt = DateTime.UtcNow
        };


        _context.Venues.Add(venue);

        await _context.SaveChangesAsync();


        return Ok(venue);
    }
}