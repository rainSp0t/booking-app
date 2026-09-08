using BookingApp.Data;
using BookingApp.DTOs.User;
using BookingApp.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public UsersController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterUserDto dto)
    {
        if (dto.Role != "Player" && dto.Role != "VenueOwner")
        {
            return BadRequest(
                "Role must be either Player or VenueOwner."
            );
        }

        var existingUser = await _context.Users
            .FirstOrDefaultAsync(u => u.Email == dto.Email);

        if (existingUser != null)
        {
            return BadRequest(
                "An account with this email already exists."
            );
        }

        var user = new User
        {
            FirstName = dto.FirstName,
            LastName = dto.LastName,
            Email = dto.Email,

            // Temporary password hashing implementation
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),

            Role = dto.Role,
            CreatedDate = DateTime.UtcNow
        };

        _context.Users.Add(user);

        await _context.SaveChangesAsync();

        return Ok(new
        {
            user.Id,
            user.FirstName,
            user.LastName,
            user.Email,
            user.Role,
            user.CreatedDate
        });
    }
}