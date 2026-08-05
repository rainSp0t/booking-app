namespace BookingApp.DTOs.Court;

public class AvailabilitySlotDto
{
    public DateTime StartTime { get; set; }

    public DateTime EndTime { get; set; }

    public bool Available { get; set; }
}