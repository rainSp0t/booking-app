import { NavLink } from "react-router-dom";

export default function VenueCard({ venue }) {
    return (
        <article className="venue-card">
            <div className="venue-card-content">
                <h2>{venue.name}</h2>

                <p className="venue-card-description">
                    {venue.description}
                </p>

                <p className="venue-card-address">
                    {venue.address}
                </p>

                <div className="venue-card-footer">
                    <span>
                        {venue.bookingDurationMinutes} min bookings
                    </span>

                    <NavLink to={`/venues/${venue.id}`}>
                        View Venue
                    </NavLink>
                </div>
            </div>
        </article>
    );
}