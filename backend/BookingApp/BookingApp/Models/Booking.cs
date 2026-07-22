namespace BookingApp.Models;

public class Booking
{
    public int Id { get; set; }


    public int UserId { get; set; }

    public int CourtId { get; set; }


    public DateTime StartTime { get; set; }

    public DateTime EndTime { get; set; }


    public string Status { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; }


    // Navigation Properties

    public User? User { get; set; }

    public Court? Court { get; set; }
}