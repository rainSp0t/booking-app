namespace BookingApp.DTOs.Court;

public class CreateCourtDto
{
    public int VenueId { get; set; }

    public string Name { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;
}