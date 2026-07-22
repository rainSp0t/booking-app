namespace BookingApp.Models;

public class Venue
{
    public int Id { get; set; }

    public int OwnerId { get; set; }

    public string Name { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public string Address { get; set; } = string.Empty;

    public string ContactNumber { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; }


    // Navigation Properties

    public User? Owner { get; set; }

    public List<Court> Courts { get; set; } = new();
}