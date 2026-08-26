namespace BookingApp.DTOs.OpeningHours;

public class UpdateOpeningHoursDto
{
    public DayOfWeek DayOfWeek { get; set; }

    public TimeSpan OpenTime { get; set; }

    public TimeSpan CloseTime { get; set; }

    public bool IsClosed { get; set; }
}