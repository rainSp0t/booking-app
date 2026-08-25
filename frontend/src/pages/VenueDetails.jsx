import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
    getVenueById,
    getCourtAvailability
} from "../services/venueService";
import { createBooking } from "../services/bookingService";
import { useAuth } from "../context/AuthContext";

export default function VenueDetails() {
    const { id } = useParams();

    const [venue, setVenue] = useState(null);
    const [error, setError] = useState("");

    const [selectedCourt, setSelectedCourt] = useState(null);
    const [selectedDate, setSelectedDate] = useState("");
    const [availability, setAvailability] = useState([]);

    const [selectedSlot, setSelectedSlot] = useState(null);
    const { isAuthenticated } = useAuth();

    const [bookingError, setBookingError] = useState("");
    const [bookingSuccess, setBookingSuccess] = useState("");
    const [isBooking, setIsBooking] = useState(false);

    useEffect(() => {
        async function loadVenue() {
            try {
                const data = await getVenueById(id);

                setVenue(data);
            } catch (error) {
                console.error("Failed to load venue:", error);

                setError("Failed to load venue.");
            }
        }

        loadVenue();
    }, [id]);

    
    useEffect(() => {
    async function loadAvailability() {
        if (!selectedCourt || !selectedDate) {
            setAvailability([]);
            return;
        }

        try {
            const data = await getCourtAvailability(
                selectedCourt,
                selectedDate
            );

            setAvailability(data);
        } catch (error) {
            console.error(
                "Failed to load availability:",
                error
            );

            setAvailability([]);
        }
    }

        loadAvailability();
    }, [selectedCourt, selectedDate]);



    async function handleBooking() {
        if (!selectedSlot || !selectedCourt) {
            return;
        }

        if (!isAuthenticated) {
            setBookingError("You must be logged in to make a booking.");
            return;
        }

        setBookingError("");
        setBookingSuccess("");
        setIsBooking(true);

        try {
            await createBooking(
                selectedCourt,
                selectedSlot.startTime,
                selectedSlot.endTime
            );

            setBookingSuccess("Booking created successfully.");
            setSelectedSlot(null);

            // Refresh availability so the newly booked slot
            // becomes unavailable.
            const updatedAvailability = await getCourtAvailability(
                selectedCourt,
                selectedDate
            );

            setAvailability(updatedAvailability);
        } catch (error) {
            console.error("Failed to create booking:", error);

            setBookingError(
                error.response?.data || "Failed to create booking."
            );
        } finally {
            setIsBooking(false);
        }
    }



    if (error) {
        return <p>{error}</p>;
    }

    if (!venue) {
        return <p>Loading...</p>;
    }

    return (
        <div>
            <h1>{venue.name}</h1>

            <p>{venue.description}</p>
            <p>{venue.address}</p>
            <p>{venue.contactNumber}</p>

            <h2>Courts</h2>

            {venue.courts.map((court) => (
                <div key={court.id}>
                    <h3>{court.name}</h3>
                    <p>{court.description}</p>
                </div>
            ))}


            <h2>Check Availability</h2>

            <div>
                <label htmlFor="court">Court</label>

                <select
                    id="court"
                    value={selectedCourt ?? ""}
                    onChange={(event) => {
                        setSelectedCourt(
                            event.target.value
                                ? Number(event.target.value)
                                : null
                        );

                        setSelectedSlot(null);
                    }}
                >
                    <option value="">Select a court</option>

                    {venue.courts.map((court) => (
                        <option key={court.id} value={court.id}>
                            {court.name}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label htmlFor="date">Date</label>

                <input
                    id="date"
                    type="date"
                    value={selectedDate}
                    onChange={(event) => {
                        setSelectedDate(event.target.value);
                        setSelectedSlot(null);
                    }}
                />
            </div>


            {availability.length > 0 && (
                <div>
                    <h3>Available Times</h3>

                    {availability.map((slot) => (
                        <div key={slot.startTime}>
                            <span>
                                {new Date(slot.startTime).toLocaleTimeString(
                                    [],
                                    {
                                        hour: "2-digit",
                                        minute: "2-digit"
                                    }
                                )}
                                {" - "}
                                {new Date(slot.endTime).toLocaleTimeString(
                                    [],
                                    {
                                        hour: "2-digit",
                                        minute: "2-digit"
                                    }
                                )}
                            </span>

                            {slot.available ? (
                                <button
                                    onClick={() => setSelectedSlot(slot)}
                                >
                                    Book
                                </button>
                            ) : (
                                <span> Booked</span>
                            )}
                        </div>
                    ))}
                </div>
            )}


            {selectedSlot && (
                <div>
                    <h3>Selected Booking</h3>

                    <p>
                        {new Date(selectedSlot.startTime).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit"
                        })}
                        {" - "}
                        {new Date(selectedSlot.endTime).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit"
                        })}
                    </p>

                    <button
                        onClick={handleBooking}
                        disabled={isBooking}
                    >
                        {isBooking ? "Booking..." : "Confirm Booking"}
                    </button>
                </div>
            )}

            {bookingError && <p>{bookingError}</p>}

            {bookingSuccess && <p>{bookingSuccess}</p>}


            <h2>Opening Hours</h2>

            {venue.openingHours.map((hours) => (
                <div key={hours.dayOfWeek}>
                    <p>
                        {hours.dayOfWeek}:{" "}
                        {hours.isClosed
                            ? "Closed"
                            : `${hours.openTime} - ${hours.closeTime}`}
                    </p>
                </div>
            ))}
        </div>
    );
}