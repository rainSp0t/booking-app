import { useEffect, useState } from "react";
import {
    getMyBookings,
    cancelBooking
} from "../services/bookingService";

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString(undefined, {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
    });
}

function formatTime(dateString) {
    return new Date(dateString).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
    });
}

function BookingCard({
    booking,
    onCancel,
    cancellingId,
    canCancel
}) {
    const isCancelled = booking.status === "Cancelled";

    return (
        <article
            className={`booking-card ${
                isCancelled ? "booking-card-cancelled" : ""
            }`}
        >
            <div className="booking-card-header">
                <div>
                    <h3>{booking.venueName}</h3>
                    <p>{booking.courtName}</p>
                </div>

                <span
                    className={`booking-status ${
                        isCancelled
                            ? "cancelled"
                            : "confirmed"
                    }`}
                >
                    {booking.status}
                </span>
            </div>

            <div className="booking-card-details">
                <div>
                    <span className="booking-detail-label">
                        Date
                    </span>

                    <span>
                        {formatDate(booking.startTime)}
                    </span>
                </div>

                <div>
                    <span className="booking-detail-label">
                        Time
                    </span>

                    <span>
                        {formatTime(booking.startTime)}
                        {" – "}
                        {formatTime(booking.endTime)}
                    </span>
                </div>
            </div>

            {canCancel && (
                <div className="booking-card-actions">
                    <button
                        type="button"
                        onClick={() => onCancel(booking.id)}
                        disabled={cancellingId === booking.id}
                    >
                        {cancellingId === booking.id
                            ? "Cancelling..."
                            : "Cancel Booking"}
                    </button>
                </div>
            )}
        </article>
    );
}

export default function MyBookings() {
    const [bookings, setBookings] = useState([]);
    const [error, setError] = useState("");
    const [cancellingId, setCancellingId] = useState(null);
    const [filter, setFilter] = useState("upcoming");

    useEffect(() => {
        async function loadBookings() {
            try {
                const data = await getMyBookings();

                setBookings(data);
            } catch (error) {
                console.error(
                    "Failed to load bookings:",
                    error
                );

                setError("Failed to load bookings.");
            }
        }

        loadBookings();
    }, []);

    async function handleCancel(bookingId) {
        setError("");
        setCancellingId(bookingId);

        try {
            await cancelBooking(bookingId);

            const updatedBookings =
                await getMyBookings();

            setBookings(updatedBookings);
        } catch (error) {
            console.error(
                "Failed to cancel booking:",
                error
            );

            setError(
                error.response?.data ||
                "Failed to cancel booking."
            );
        } finally {
            setCancellingId(null);
        }
    }

    const now = new Date();

    const upcomingBookings = bookings.filter(
        (booking) =>
            booking.status === "Confirmed" &&
            new Date(booking.startTime) > now
    );

    const pastBookings = bookings.filter(
        (booking) =>
            booking.status === "Confirmed" &&
            new Date(booking.startTime) <= now
    );

    const cancelledBookings = bookings.filter(
        (booking) => booking.status === "Cancelled"
    );

    const filteredBookings =
        filter === "upcoming"
            ? upcomingBookings
            : filter === "past"
                ? pastBookings
                : cancelledBookings;

    function renderBookings(bookings, emptyMessage) {
        if (bookings.length === 0) {
            return (
                <p className="booking-empty">
                    {emptyMessage}
                </p>
            );
        }

        return (
            <div className="bookings-list">
                {bookings.map((booking) => (
                    <BookingCard
                        key={booking.id}
                        booking={booking}
                        onCancel={handleCancel}
                        cancellingId={cancellingId}
                        canCancel={
                            filter === "upcoming" &&
                            booking.status === "Confirmed"
                        }
                    />
                ))}
            </div>
        );
    }

    if (error && bookings.length === 0) {
        return (
            <div className="my-bookings-page">
                <h1>My Bookings</h1>
                <p className="error-message">{error}</p>
            </div>
        );
    }

    return (
        <div className="my-bookings-page">
            <header className="page-header">
                <h1>My Bookings</h1>
                <p>
                    View and manage your court bookings.
                </p>
            </header>

            {error && (
                <p className="error-message">
                    {error}
                </p>
            )}

            <div className="booking-filters">
                <button
                    type="button"
                    className={
                        filter === "upcoming" ? "active" : ""
                    }
                    onClick={() => setFilter("upcoming")}
                >
                    Upcoming
                    <span>{upcomingBookings.length}</span>
                </button>

                <button
                    type="button"
                    className={
                        filter === "past" ? "active" : ""
                    }
                    onClick={() => setFilter("past")}
                >
                    Past
                    <span>{pastBookings.length}</span>
                </button>

                <button
                    type="button"
                    className={
                        filter === "cancelled" ? "active" : ""
                    }
                    onClick={() => setFilter("cancelled")}
                >
                    Cancelled
                    <span>{cancelledBookings.length}</span>
                </button>
            </div>

            <section className="booking-section">
                <div className="booking-section-header">
                    <h2>
                        {filter === "upcoming"
                            ? "Upcoming Bookings"
                            : filter === "past"
                                ? "Past Bookings"
                                : "Cancelled Bookings"}
                    </h2>

                    <span>{filteredBookings.length}</span>
                </div>

                {renderBookings(
                    filteredBookings,
                    filter === "upcoming"
                        ? "You don't have any upcoming bookings."
                        : filter === "past"
                            ? "You don't have any past bookings."
                            : "You don't have any cancelled bookings."
                )}
            </section>
        </div>
    );
}