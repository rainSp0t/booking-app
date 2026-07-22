namespace BookingApp.Models;

public class OpeningHours
{
    public int Id { get; set; }


    public int VenueId { get; set; }


    public DayOfWeek DayOfWeek { get; set; }


    public TimeSpan OpenTime { get; set; }

    public TimeSpan CloseTime { get; set; }


    public bool IsClosed { get; set; }


    // Navigation Property

    public Venue? Venue { get; set; }
}