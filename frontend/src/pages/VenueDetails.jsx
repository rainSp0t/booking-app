import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
    getVenueById,
    getCourtAvailability
} from "../services/venueService";
import BookingCalendar from "../components/BookingCalendar";
import {
    useNavigate,
    useLocation
} from "react-router-dom";

export default function VenueDetails() {
    const { id } = useParams();

    const [venue, setVenue] = useState(null);
    const [error, setError] = useState("");

    const [selectedCourt, setSelectedCourt] = useState(null);
    const [selectedDate, setSelectedDate] = useState("");
    const [availability, setAvailability] = useState([]);

    const [selectedSlot, setSelectedSlot] = useState(null);

    const [bookingError, setBookingError] = useState("");
    const [bookingSuccess, setBookingSuccess] = useState("");

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        async function loadVenue() {
            try {
                const data = await getVenueById(id);

                setVenue(data);

                if (data.courts.length > 0) {
                    setSelectedCourt(data.courts[0].id);
                }
            } catch (error) {
                console.error("Failed to load venue:", error);

                setError("Failed to load venue.");
            }
        }

        loadVenue();
    }, [id]);

    useEffect(() => {
        if (location.state?.bookingSuccess) {
            setBookingSuccess("Booking created successfully.");

            window.history.replaceState(
                {},
                document.title,
                window.location.pathname
            );
        }
    }, [location.state]);

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

    useEffect(() => {
        if (!bookingSuccess) {
            return;
        }

        const timer = setTimeout(() => {
            setBookingSuccess("");
        }, 4000);

        return () => clearTimeout(timer);
    }, [bookingSuccess]);

    if (error) {
        return <p>{error}</p>;
    }

    if (!venue) {
        return <p>Loading...</p>;
    }

    const orderedOpeningHours = [...venue.openingHours].sort(
        (a, b) => {
            const dayA = a.dayOfWeek === 0 ? 7 : a.dayOfWeek;
            const dayB = b.dayOfWeek === 0 ? 7 : b.dayOfWeek;

            return dayA - dayB;
        }
    );

    const visibleAvailability = availability.filter((slot) => {
        const now = new Date();
        const startTime = new Date(slot.startTime);

        return startTime > now;
    });

    return (
        <div className="venue-details-page">
            <button
                type="button"
                className="back-button"
                onClick={() => navigate("/")}
            >
                ← Back to venues
            </button>

            <header className="venue-details-header">
                <h1>{venue.name}</h1>

                <p className="venue-details-description">
                    {venue.description}
                </p>

                <p className="venue-details-address">
                    {venue.address}
                </p>

                <p className="venue-details-contact">
                    {venue.contactNumber}
                </p>
            </header>

            <section className="venue-section">
                <h2>Courts</h2>

                <div className="court-list">
                    {venue.courts.map((court) => (
                        <div
                            key={court.id}
                            className={
                                selectedCourt === court.id
                                    ? "court-card selected"
                                    : "court-card"
                            }
                        >
                            <h3>{court.name}</h3>

                            <p>{court.description}</p>

                            <button
                                type="button"
                                onClick={() => {
                                    setSelectedCourt(court.id);
                                    setSelectedSlot(null);
                                    setAvailability([]);
                                }}
                            >
                                {selectedCourt === court.id
                                    ? "Selected"
                                    : "Select Court"}
                            </button>
                        </div>
                    ))}
                </div>
            </section>

            <section className="venue-section booking-section">
                <h2>Check Availability</h2>

                <div className="booking-calendar-section">
                    <h3>Select a date</h3>

                    <BookingCalendar
                        openingHours={venue.openingHours}
                        selectedDate={selectedDate}
                        onDateSelect={(date) => {
                            setSelectedDate(date);
                            setSelectedSlot(null);
                            setBookingError("");
                        }}
                    />
                </div>

                {selectedCourt && selectedDate && (
                    <div className="availability-section">
                        <h3>Available Times</h3>

                        {visibleAvailability.length === 0 ? (
                            <p className="empty-message">
                                No available times found for this date.
                            </p>
                        ) : (
                            <div className="availability-grid">
                                {visibleAvailability.map((slot) => {
                                    const start = new Date(
                                        slot.startTime
                                    ).toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit"
                                    });

                                    const end = new Date(
                                        slot.endTime
                                    ).toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit"
                                    });

                                    const isSelected =
                                        selectedSlot?.startTime ===
                                        slot.startTime;

                                    return (
                                        <button
                                            key={slot.startTime}
                                            type="button"
                                            className={`availability-slot ${
                                                slot.available
                                                    ? "available"
                                                    : "booked"
                                            } ${
                                                isSelected
                                                    ? "selected"
                                                    : ""
                                            }`}
                                            disabled={!slot.available}
                                            onClick={() =>
                                                setSelectedSlot(slot)
                                            }
                                        >
                                            <span className="slot-time">
                                                {start}
                                            </span>

                                            <span className="slot-end">
                                                {end}
                                            </span>

                                            <span className="slot-status">
                                                {slot.available
                                                    ? isSelected
                                                        ? "Selected"
                                                        : "Available"
                                                    : "Booked"}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}

                {selectedSlot && (
                    <div className="booking-summary">
                        <h3>Selected Booking</h3>

                        <p>
                            {new Date(
                                selectedSlot.startTime
                            ).toLocaleDateString(undefined, {
                                weekday: "long",
                                day: "numeric",
                                month: "long",
                                year: "numeric"
                            })}
                        </p>

                        <p>
                            {new Date(
                                selectedSlot.startTime
                            ).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit"
                            })}
                            {" - "}
                            {new Date(
                                selectedSlot.endTime
                            ).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit"
                            })}
                        </p>

                        <button
                            type="button"
                            className="primary-button"
                            onClick={() =>
                                navigate("/payment", {
                                    state: {
                                        venueId: venue.id,
                                        venueName: venue.name,
                                        courtId: selectedCourt,
                                        courtName: venue.courts.find(
                                            (court) =>
                                                court.id === selectedCourt
                                        )?.name,
                                        startTime:
                                            selectedSlot.startTime,
                                        endTime:
                                            selectedSlot.endTime
                                    }
                                })
                            }
                        >
                            Continue to Payment
                        </button>
                    </div>
                )}

                {bookingError && (
                    <p className="error-message">
                        {bookingError}
                    </p>
                )}
            </section>

            <section className="venue-section opening-hours-section">
                <div className="section-header">
                    <div>
                        <h2>Opening Hours</h2>
                        <p>Venue operating hours</p>
                    </div>
                </div>

                <div className="opening-hours-list">
                    {orderedOpeningHours.map((hours) => {
                        const day = [
                            "Sunday",
                            "Monday",
                            "Tuesday",
                            "Wednesday",
                            "Thursday",
                            "Friday",
                            "Saturday"
                        ][hours.dayOfWeek];

                        return (
                            <div
                                key={hours.dayOfWeek}
                                className="opening-hours-row"
                            >
                                <span className="opening-hours-day">
                                    {day}
                                </span>

                                <span
                                    className={
                                        hours.isClosed
                                            ? "opening-hours-time closed"
                                            : "opening-hours-time"
                                    }
                                >
                                    {hours.isClosed
                                        ? "Closed"
                                        : `${hours.openTime.slice(0, 5)} – ${hours.closeTime.slice(0, 5)}`}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </section>

            {bookingSuccess && (
                <div
                    className="success-toast"
                    role="status"
                >
                    <span>✓</span>
                    <span>{bookingSuccess}</span>
                </div>
            )}
        </div>
    );
}