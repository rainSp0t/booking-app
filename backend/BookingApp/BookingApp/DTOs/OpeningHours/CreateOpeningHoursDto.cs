namespace BookingApp.DTOs.OpeningHours;

public class CreateOpeningHoursDto
{
    public int VenueId { get; set; }

    public DayOfWeek DayOfWeek { get; set; }

    public TimeSpan OpenTime { get; set; }

    public TimeSpan CloseTime { get; set; }

    public bool IsClosed { get; set; }
}