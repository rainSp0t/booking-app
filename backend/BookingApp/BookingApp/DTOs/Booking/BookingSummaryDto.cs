namespace BookingApp.DTOs.Booking;

public class BookingSummaryDto
{
    public int Id { get; set; }

    public string VenueName { get; set; } = string.Empty;

    public string CourtName { get; set; } = string.Empty;

    public DateTime StartTime { get; set; }

    public DateTime EndTime { get; set; }

    public string Status { get; set; } = string.Empty;
}