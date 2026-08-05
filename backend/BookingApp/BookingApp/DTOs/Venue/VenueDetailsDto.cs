namespace BookingApp.DTOs.Venue;

public class VenueDetailsDto
{
    public int Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public string Address { get; set; } = string.Empty;

    public string ContactNumber { get; set; } = string.Empty;

    public int BookingDurationMinutes { get; set; }

    public List<CourtDto> Courts { get; set; } = new();

    public List<OpeningHoursDto> OpeningHours { get; set; } = new();
}