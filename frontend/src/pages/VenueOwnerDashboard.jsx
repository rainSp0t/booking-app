import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyVenues } from "../services/venueService";

export default function VenueOwnerDashboard() {
    const [venues, setVenues] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadVenues() {
            try {
                const data = await getMyVenues();

                setVenues(data);
            } catch (error) {
                console.error(
                    "Failed to load venues:",
                    error
                );

                setError("Failed to load your venues.");
            }
        }

        loadVenues();
    }, []);

    if (error) {
        return (
            <div className="venue-owner-page">
                <header className="page-header">
                    <h1>My Venues</h1>
                </header>

                <p className="error-message">
                    {error}
                </p>
            </div>
        );
    }

    return (
        <div className="venue-owner-page">
            <header className="venue-owner-header">
                <div>
                    <h1>My Venues</h1>

                    <p>
                        Manage your venues, courts, opening hours
                        and bookings.
                    </p>
                </div>

                <Link
                    to="/venue-owner/venues/create"
                    className="primary-button"
                >
                    + Create Venue
                </Link>
            </header>

            {venues.length === 0 ? (
                <div className="empty-venues">
                    <h2>No venues yet</h2>

                    <p>
                        Create your first venue to start
                        managing courts and bookings.
                    </p>

                    <Link
                        to="/venue-owner/venues/create"
                        className="primary-button"
                    >
                        Create Your First Venue
                    </Link>
                </div>
            ) : (
                <div className="venue-owner-grid">
                    {venues.map((venue) => (
                        <article
                            key={venue.id}
                            className="owner-venue-card"
                        >
                            <div className="owner-venue-content">
                                <div className="owner-venue-header">
                                    <div>
                                        <h2>{venue.name}</h2>

                                        <p className="owner-venue-address">
                                            {venue.address}
                                        </p>
                                    </div>
                                </div>

                                <p className="owner-venue-description">
                                    {venue.description ||
                                        "No description provided."}
                                </p>

                                <div className="owner-venue-info">
                                    <div>
                                        <span>
                                            Booking duration
                                        </span>

                                        <strong>
                                            {
                                                venue.bookingDurationMinutes
                                            }{" "}
                                            minutes
                                        </strong>
                                    </div>
                                </div>
                            </div>

                            <div className="owner-venue-actions">
                                <Link
                                    to={`/venue-owner/venues/${venue.id}/courts`}
                                >
                                    Manage Courts
                                </Link>

                                <Link
                                    to={`/venue-owner/venues/${venue.id}/opening-hours`}
                                >
                                    Opening Hours
                                </Link>

                                <Link
                                    to={`/venue-owner/venues/${venue.id}/bookings`}
                                >
                                    Bookings
                                </Link>
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </div>
    );
}