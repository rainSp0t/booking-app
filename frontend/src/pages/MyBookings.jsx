import { useEffect, useState } from "react";
import {
    getMyBookings,
    cancelBooking
} from "../services/bookingService";

export default function MyBookings() {
    const [bookings, setBookings] = useState([]);
    const [error, setError] = useState("");

    const [cancellingId, setCancellingId] = useState(null);
    const [actionError, setActionError] = useState("");


    async function handleCancel(bookingId) {
        setActionError("");
        setCancellingId(bookingId);

        try {
            await cancelBooking(bookingId);

            const updatedBookings = await getMyBookings();

            setBookings(updatedBookings);
        } catch (error) {
            console.error("Failed to cancel booking:", error);

            setActionError(
                error.response?.data || "Failed to cancel booking."
            );
        } finally {
            setCancellingId(null);
        }
    }

    useEffect(() => {
        async function loadBookings() {
            try {
                const data = await getMyBookings();

                setBookings(data);
            } catch (error) {
                console.error("Failed to load bookings:", error);

                setError("Failed to load bookings.");
            }
        }

        loadBookings();
    }, []);

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div>
            
            <h1>My Bookings</h1>

            {actionError && <p>{actionError}</p>}

            {bookings.length === 0 ? (
                <p>You don't have any bookings.</p>
            ) : (
                bookings.map((booking) => (
                    <div key={booking.id}>
                        <h2>{booking.venueName}</h2>

                        <p>Court: {booking.courtName}</p>

                        <p>
                            Date:{" "}
                            {new Date(
                                booking.startTime
                            ).toLocaleDateString()}
                        </p>

                        <p>
                            {new Date(
                                booking.startTime
                            ).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit"
                            })}
                            {" - "}
                            {new Date(
                                booking.endTime
                            ).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit"
                            })}
                        </p>

                        <p>Status: {booking.status}</p>

                        {booking.status === "Confirmed" && (
                            <button
                                onClick={() => handleCancel(booking.id)}
                                disabled={cancellingId === booking.id}
                            >
                                {cancellingId === booking.id
                                    ? "Cancelling..."
                                    : "Cancel Booking"}
                            </button>
                        )}
                    </div>
                ))
            )}
        </div>
    );
}