import { useEffect, useState } from "react";
import { getMyVenues } from "../services/venueService";
import { Link } from "react-router-dom";

export default function VenueOwnerDashboard() {
    const [venues, setVenues] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadVenues() {
            try {
                const data = await getMyVenues();

                setVenues(data);
            } catch (error) {
                console.error("Failed to load venues:", error);

                setError("Failed to load your venues.");
            }
        }

        loadVenues();
    }, []);

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div>
            <Link to="/venue-owner/venues/create">
                Create Venue
            </Link>

            <h1>My Venues</h1>

            {venues.length === 0 ? (
                <p>You don't have any venues yet.</p>
            ) : (
                venues.map((venue) => (
                    <div key={venue.id}>
                        <h2>{venue.name}</h2>

                        <p>{venue.description}</p>
                        <p>{venue.address}</p>

                        <p>
                            Booking duration:{" "}
                            {venue.bookingDurationMinutes} minutes
                        </p>

                        <Link
                            to={`/venue-owner/venues/${venue.id}/courts`}
                        >
                            Manage Courts
                        </Link>
                    </div>
                ))
            )}
        </div>
    );
}