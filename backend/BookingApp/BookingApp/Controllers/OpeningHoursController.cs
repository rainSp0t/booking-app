using BookingApp.Data;
using BookingApp.DTOs.OpeningHours;
using BookingApp.Models;
using Microsoft.AspNetCore.Mvc;

namespace BookingApp.Controllers;

[ApiController]
[Route("api/[controller]")]
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


        return Ok(openingHours);
    }
}