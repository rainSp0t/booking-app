import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    getVenueById
} from "../services/venueService";
import {
    getVenueBookings
} from "../services/bookingService";

export default function ManageVenueBookings() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [venue, setVenue] = useState(null);
    const [bookings, setBookings] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadData() {
            try {
                const [venueData, bookingData] = await Promise.all([
                    getVenueById(id),
                    getVenueBookings(id)
                ]);

                setVenue(venueData);
                setBookings(bookingData);
            } catch (error) {
                console.error(
                    "Failed to load venue bookings:",
                    error
                );

                setError("Failed to load venue bookings.");
            }
        }

        loadData();
    }, [id]);

    if (error) {
        return <p>{error}</p>;
    }

    if (!venue) {
        return <p>Loading...</p>;
    }

    return (
        <div>
            <button onClick={() => navigate("/venue-owner")}>
                Back to My Venues
            </button>

            <h1>Manage Bookings</h1>
            <h2>{venue.name}</h2>

            {bookings.length === 0 ? (
                <p>No bookings found for this venue.</p>
            ) : (
                bookings.map((booking) => (
                    <div key={booking.id}>
                        <h3>{booking.courtName}</h3>

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
                    </div>
                ))
            )}
        </div>
    );
}