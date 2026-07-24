namespace BookingApp.DTOs.Booking;

public class CreateBookingDto
{
    public int UserId { get; set; }

    public int CourtId { get; set; }

    public DateTime StartTime { get; set; }

    public DateTime EndTime { get; set; }
}