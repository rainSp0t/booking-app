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
}