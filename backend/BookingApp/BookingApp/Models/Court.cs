namespace BookingApp.Models;

public class Court
{
    public int Id { get; set; }

    public int VenueId { get; set; }

    public string Name { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public bool IsActive { get; set; }

    public DateTime CreatedAt { get; set; }


    // Navigation Properties

    public Venue? Venue { get; set; }

    public List<Booking> Bookings { get; set; } = new();
}